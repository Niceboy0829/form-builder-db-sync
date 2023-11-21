import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { diff_match_patch } from 'diff-match-patch';

const options = {
  editCost: 1,
  interLineDiff: true,
  ignoreTrailingNewLines: true,
  attrs: {
    insert: {
      'data-attr': 'insert',
      'class': 'insertion'
    },
    delete: {
      'data-attr': 'delete'
    },
    equal: {
      'data-attr': 'equal'
    }
  }
}

const DIFF_INSERT = 1
const DIFF_DELETE = -1
const LINEDIFF = 1;
const INSDEL = 0

export interface DialogData {
  name: string,
  leftLines: string,
  rightLines: string,
}

@Component({
  selector: 'app-diff-modal',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './diff-modal.component.html',
  styleUrls: ['./diff-modal.component.scss']
})
export class DiffModalComponent implements OnInit {
  diffHtml = ""
  lineHash : any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }

  ngOnInit(): void {
    this.diffHtml = this.createLineDiffHtml( this.data.leftLines, this.data.rightLines, options )
  }

  createLineDiffHtml(left: string, right: string, options: any) {
    let dmp;
    let chars;
    let diffs;
    dmp = new diff_match_patch();
    const ignoreTrailingNewLines = options?.ignoreTrailingNewLines;
    chars = this.linesToChars(left, right, ignoreTrailingNewLines);
    diffs = dmp.diff_main(chars.chars1, chars.chars2, false);
    console.log(chars, diffs)
    this.charsToLines(diffs, chars.lineArray, ignoreTrailingNewLines);
    return this.createHtmlFromDiffs(diffs, INSDEL, options);

  }

  // Taken from source https://code.google.com/p/google-diff-match-patch/
  // and then modified for style and to strip newline
  linesToChars = (text1: string, text2: string, ignoreTrailingNewLines: boolean) => {
    const lineArray = [];
    lineArray[0] = '';

    const linesToCharsMunge = (text: string) => {
      let chars = '';
      let lineStart = 0;
      let lineEnd = -1;
      let lineArrayLength = lineArray.length;
      let hasNewLine = false;
      while (lineEnd < text.length - 1) {
        lineEnd = text.indexOf('\n', lineStart);
        hasNewLine = (lineEnd !== -1);
        if (!hasNewLine) {
          lineEnd = text.length - 1;
        }

        const line = text.slice(lineStart, lineEnd + ((ignoreTrailingNewLines && hasNewLine) ? 0 : 1));
        lineStart = lineEnd + 1;

        if (Object.prototype.hasOwnProperty.call(this.lineHash, line)) {
          chars += String.fromCharCode(this.lineHash[line]); // eslint-disable-line unicorn/prefer-code-point
        } else {
          chars += String.fromCharCode(lineArrayLength); // eslint-disable-line unicorn/prefer-code-point
          this.lineHash[line] = lineArrayLength;
          lineArray[lineArrayLength++] = line;
        }
      }

      return chars;
    }

    const chars1 = linesToCharsMunge(text1);
    const chars2 = linesToCharsMunge(text2);
    return { chars1, chars2, lineArray };
  }


  // Taken from source https://code.google.com/p/google-diff-match-patch/
  // and then modified for style and to strip newline
  charsToLines(diffs: any[], lineArray: any[], ignoreTrailingNewLines: boolean) {
    for (let i = 0; i < diffs.length; i++) { // eslint-disable-line unicorn/no-for-loop
      const chars = diffs[i][1];
      const text = [];
      for (let y = 0; y < chars.length; y++) {
        text[y] = lineArray[chars.charCodeAt(y)]; // eslint-disable-line unicorn/prefer-code-point
      }

      diffs[i][1] = text.join((ignoreTrailingNewLines) ? '\n' : '');
    }
  }

  createHtmlFromDiffs(diffs: any[], display: number, options: any, excludeOp?: number): any {
    let x;
    const html = [];
    let y;
    let op;
    let text;
    const diffData = diffs;
    const dmp = new diff_match_patch();
    let intraDiffs;
    let intraHtml1;
    let intraHtml2;

    for (x = 0; x < diffData.length; x++) {
      diffData[x][1] = diffData[x][1].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    for (y = 0; y < diffData.length; y++) {
      op = diffData[y][0];
      text = diffData[y][1];
      if (display === LINEDIFF) {
        if (options?.interLineDiff && diffs[y][0] === DIFF_DELETE && diffs[y + 1] && diffs[y + 1][0] === DIFF_INSERT && !diffs[y][1].includes('\n')) {
          intraDiffs = dmp.diff_main(diffs[y][1], diffs[y + 1][1]);
          dmp.diff_cleanupSemantic(intraDiffs);
          intraHtml1 = this.createHtmlFromDiffs(intraDiffs, 0, options, DIFF_INSERT);
          intraHtml2 = this.createHtmlFromDiffs(intraDiffs, 0, options, DIFF_DELETE);
          html[y] = this.createHtmlLines(intraHtml1, DIFF_DELETE, options);
          html[y + 1] = this.createHtmlLines(intraHtml2, DIFF_INSERT, options);
          y++;
        } else {
          html[y] = this.createHtmlLines(text, op, options);
        }
      } else if (typeof excludeOp === 'undefined' || op !== excludeOp) {
        html[y] = this.getHtmlPrefix(op, display, options) + "<pre>" + text + "</pre>" + this.getHtmlSuffix(op, display);
      }
    }

    return html.join('');
  }

  
  createHtmlLines(text: string, op: number, options: any): any {
    const lines = text.split('\n');
    let y;
    for (y = 0; y < lines.length; y++) {
      if (lines[y].length === 0) {
        continue;
      }

      lines[y] = this.getHtmlPrefix(op, LINEDIFF, options) + "<pre>" + lines[y] + "</pre>" + this.getHtmlSuffix(op, LINEDIFF);
    }

    return lines.join('');
  }

  getHtmlPrefix(op: number, display: number, options: any) {
    switch (display) {
      case LINEDIFF: {
        return '<div class="' + this.diffClass(op) + '"><span' + this.getTagAttrs(options, op, {class: 'noselect'}) + '>' + this.diffSymbol(op) + '</span>';
      }

      default: { // case displayType.INSDEL:
        return '<' + this.diffTag(op) + this.getTagAttrs(options, op) + '>';
      }
    }
  }

  getHtmlSuffix(op: number, display: number) {
    switch (display) {
      case LINEDIFF: {
        return '</div>';
      }

      default: { // case displayType.INSDEL:
        return '</' + this.diffTag(op) + '>';
      }
    }
  }

  
  diffTag(op: number) {
    switch (op) {
      case DIFF_INSERT: {
        return 'ins';
      }

      case DIFF_DELETE: {
        return 'del';
      }

      default: { // case DIFF_EQUAL:
        return 'span';
      }
    }
  }

  diffAttrName(op: number) {
    switch (op) {
      case DIFF_INSERT: {
        return 'insert';
      }

      case DIFF_DELETE: {
        return 'delete';
      }

      default: { // case DIFF_EQUAL:
        return 'equal';
      }
    }
  }

  getTagAttrs(options: any, op: number, attrs?: any) {
    let tagOptions = {};
    const returnValue = [];
    const opName = this.diffAttrName(op);

    if (options?.attrs) {
      const attributesFromOptions = options.attrs[opName];
      if (attributesFromOptions) {
        tagOptions = { ...tagOptions, ...attributesFromOptions}
      }
    }

    if (attrs) {
      tagOptions = { ...tagOptions, ...attrs };
    }

    if (Object.keys(tagOptions).length === 0) {
      return '';
    }

    for (const [key, value] of Object.entries(tagOptions)) {
      returnValue.push(key + '="' + value + '"');
    }

    return ' ' + returnValue.join(' ');
  }

  diffClass(op: number) {
    switch (op) {
      case DIFF_INSERT: {
        return 'ins';
      }

      case DIFF_DELETE: {
        return 'del';
      }

      default: { // case DIFF_EQUAL:
        return 'match';
      }
    }
  }

  diffSymbol(op: number) {
    switch (op) {
      case DIFF_INSERT: {
        return '+';
      }

      case DIFF_DELETE: {
        return '-';
      }

      default: { // case DIFF_EQUAL:
        return ' ';
      }
    }
  }
}
