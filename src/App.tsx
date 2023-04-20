import "./App.css";
import "bulma/css/bulma.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createRef } from "react";

function App() {
  const refEditor = createRef<CKEditor<ClassicEditor>>();

  const handleChange = () => {
    if (!refEditor.current) {
      return;
    }
    console.log(refEditor.current.editor?.data?.get());
    console.log(
      Array.from(refEditor.current.editor?.ui.componentFactory.names() ?? [])
    );
  };

  return (
    <div className="App">
      <div className="floating-action-buttons">
        <button>Save</button>
      </div>
      <div className="content">
        <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "|",
              "bulletedList",
              "numberedList",
              "indent",
              "outdent",
              "|",
              "imageUpload",
              "insertTable",
              "blockQuote",
              "|",
              "undo",
              "redo",
            ],
            heading: {
              options: [
                {
                  model: "paragraph",
                  title: "Paragraph",
                  class: "ck-heading_paragraph",
                },
                {
                  model: "heading1",
                  view: "h1",
                  title: "Heading 1",
                  class: "ck-heading_heading1",
                },
                {
                  model: "heading2",
                  view: "h2",
                  title: "Heading 2",
                  class: "ck-heading_heading2",
                },
                {
                  model: "heading3",
                  view: "h3",
                  title: "Heading 3",
                  class: "ck-heading_heading3",
                },
                {
                  model: "heading4",
                  view: "h4",
                  title: "Heading 4",
                  class: "ck-heading_heading4",
                },
                {
                  model: "heading5",
                  view: "h5",
                  title: "Heading 5",
                  class: "ck-heading_heading5",
                },
                {
                  model: "heading6",
                  view: "h6",
                  title: "Heading 6",
                  class: "ck-heading_heading6",
                },
              ],
            },
          }}
          ref={refEditor}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default App;
