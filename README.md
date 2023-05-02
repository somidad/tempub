# tempub

Templated document publishing

## Features

- WYSIWYG editing
- Save to local file
- Load from local file
- Conditional templating
- Preview with grouping

## Usage

### Format of data

```json
{
  "metadata": {
    "key": "key",
    "varname": "data"
  },
  "data": [
    {
      "key": "key 1",
      "property 1": true,
      "property 2": 99
    }
  ]
}
```

## To dos

- [x] Load data for templating
- [x] Image upload (base64)
- [ ] Check validity of data
- [ ] Template delimiters usage
- [ ] Copy formatted
- [ ] Highlight template delimiters

## Stacks used

- UI: [React](https://react.dev)
- Editor: [CKEditor5](https://ckeditor.com)
- Templating: [doT.js](https://olado.github.io/doT)
- CSS: [Bulma](https://bulma.io)
- Build tool: [Vite](https://vitejs.dev)

## Sponsor

If you feel this is useful, please consider to buy me a coffee:

<a href="https://www.buymeacoffee.com/proj3rd" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" width="217" height="60" style="height: 60px !important;width: 217px !important;" ></a>
