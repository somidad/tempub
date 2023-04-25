import "./App.css";
import "bulma/css/bulma.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createRef, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import dot from "dot";
import editorConfig from "./editorConfig";
import ModalProofreading from "./components/ModalProofreading";

export enum EditorState {
  Editing,
  Publishing,
  Displaying,
}

export type RenderResult = {
  [KEY]: string;
  rendered: string;
};

// TODO: Make these configurable
const KEY = "key";
dot.templateSettings.varname = "data";

function App() {
  const refFile = createRef<HTMLInputElement>();
  const refFilename = createRef<HTMLInputElement>();
  const refEditor = createRef<CKEditor<ClassicEditor>>();
  const [envList, setEnvList] = useState<any[]>([
    { key: "Key 0" },
    { key: "Key 1" },
    { key: "Key 2" },
    { key: "Key 3" },
    { key: "Key 4" },
    { key: "Key 5" },
    { key: "Key 6" },
    { key: "Key 7" },
    { key: "Key 8" },
    { key: "Key 9" },
  ]);
  const [renderList, setRenderList] = useState<RenderResult[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.Editing
  );

  useEffect(() => {
    if (!refFile.current || !refEditor.current?.editor) {
      return;
    }
    refFile.current.addEventListener("change", () => {
      const file = refFile.current?.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (!refFilename.current || typeof reader.result !== "string") {
          return;
        }
        const splitted = file.name.split(".");
        splitted.pop();
        refFilename.current.value = splitted.join(".");
        refEditor.current?.editor?.data.set(reader.result);
      });
      reader.readAsText(file);
    });
  }, [refFile, refEditor]);

  const clearEditor = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    refEditor.current.editor.data.set("");
  };

  const load = () => {
    if (!refFile.current) {
      return;
    }
    refFile.current.click();
  };

  const save = () => {
    if (!refEditor.current?.editor) {
      return;
    }
    const blob = new Blob([refEditor.current.editor.data.get()]);
    const name = refFilename.current?.value || "tempub";
    saveAs(blob, `${name}.html`);
  };

  const publish = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    setEditorState(EditorState.Publishing);
    const template = refEditor.current.editor.data.get();
    const templateFunction = dot.template(template);

    const renderList: RenderResult[] = [];
    envList.forEach((env) => {
      const rendered = templateFunction(env);
      renderList.push({ [KEY]: env[KEY], rendered });
    });
    setRenderList(renderList);
    setEditorState(EditorState.Displaying);
  };

  const tryCloseModal = () => {
    if (editorState === EditorState.Displaying) {
      setEditorState(EditorState.Editing);
    }
  };

  return (
    <div className="App">
      <div className="field is-grouped">
        <div className="control">
          <a className="button is-text" onClick={clearEditor}>
            New
          </a>
        </div>
        <div className="control">
          <a className="button is-text" onClick={load}>
            Load
          </a>
          <input type="file" ref={refFile} style={{ display: "none" }} />
        </div>
        <div className="control">
          <input className="input" ref={refFilename}></input>
        </div>
        <div className="control">
          <a className="button is-text" onClick={save}>
            Save
          </a>
        </div>
        <div className="control">
          <a className="button is-text">Info</a>
        </div>
        <div className="control">
          <a className="button is-text" onClick={publish}>
            Publish
          </a>
        </div>
      </div>
      <div className="content">
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          ref={refEditor}
        />
      </div>
      <ModalProofreading
        onClose={tryCloseModal}
        editorState={editorState}
        renderList={renderList}
        KEY={KEY}
      />
    </div>
  );
}

export default App;
