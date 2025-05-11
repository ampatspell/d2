## d2

Checkout `d2` repo in `~/dummy`.

```
cd ~/dummy/d2
nvm use
npm install
```

Create your SvelteKit app in `~/dummy`

```
cd ~/dummy
npx sv@latest create
```

* name (`amateurinmotion` in this example)
* SvelteKit minimal
* Yes, using TypeScript syntax
* prettier
* eslint
* npm

Create `d2.json` in `d2`

Paths are relative from `d2`

``` json
{
  "amateurinmotion": "../amateurinmotion"
}
```

Create `d2.json` in your app

``` json
{
  "admin": "ampatspell@gmail.com",
  "region": {
    "functions": "europe-west1",
    "bucket": "europe-west1"
  },
  "firebase": {
    "apiKey": "…",
    "authDomain": "…",
    "databaseURL": "…",
    "projectId": "…",
    "storageBucket": "…",
    "messagingSenderId": "…",
    "appId": "…"
  }
}
```

Link d2 to your app

```
cd ~/dummy/d2
npm run cli
```

* select an app
* symlink "amateurinmotion"

> Delete `+page.svelte` if symlink says so

Install your app's dependencies

```
cd ~/dummy/amateurinmotion
npm install
```

Run your app locally

```
npm run dev
o
```

Deploy your app

```
cd ~/dummy/d2
npm run cli
```

* deploy "amateurinmotion"
