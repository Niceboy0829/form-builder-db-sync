ID System for ui compare between different databases

Copy test.env and rename .env 

Set API PORT number


```bash
npm i
npm run build --project frontend
```
Copy and paste the content of `dist/frontend` folder into `projects/api/public` folder.

```
npm run api
```

Visit `http://localhost:3030` on your browser.


## Prerequest
### To development

in file - `project/frontent/src/config/index.ts`, set API_BASE_URL as `'http://localhost:3030/api'`.

the file content like following.

```typescript
export const API_BASE_URI: string = 'http://localhost:3030/api'
// export const API_BASE_URI: string = '/api'
```

### To build

In file - `project/frontent/src/config/index.ts`, set API_BASE_URL as `'/api'`.

The file content like following.

```typescript
// export const API_BASE_URI: string = 'http://localhost:3030/api'
export const API_BASE_URI: string = '/api'
```

Thank you.

From Tat.Ming