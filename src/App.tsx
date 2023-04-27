import "./App.css";
import "bulma/css/bulma.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
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
  key: string;
  rendered: string;
};

dot.templateSettings.varname = "data";

function App() {
  const refFileTemplate = createRef<HTMLInputElement>();
  const refFilename = createRef<HTMLInputElement>();
  const refFileData = createRef<HTMLInputElement>();
  const refEditor = createRef<CKEditor<ClassicEditor>>();
  const [metadata, setMetadata] = useState<any>({ key: "key" });
  const [dataList, setDataList] = useState<any[]>([]);
  const [renderList, setRenderList] = useState<RenderResult[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.Editing
  );

  useEffect(() => {
    if (
      !refFileTemplate.current ||
      !refFileData.current ||
      !refEditor.current?.editor
    ) {
      return;
    }
    refFileTemplate.current.addEventListener("change", () => {
      const file = refFileTemplate.current?.files?.[0];
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
    refFileData.current.addEventListener("change", () => {
      const file = refFileData.current?.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") {
          return;
        }
        const { metadata, data } = JSON.parse(reader.result);
        setMetadata(metadata);
        dot.templateSettings.varname = metadata.varname || "data";
        setDataList(data);
      });
      reader.readAsText(file);
    });
  }, [refFileTemplate, refFileData, refEditor]);

  const clearEditor = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    refEditor.current.editor.data.set("");
  };

  const loadTemplate = () => {
    if (!refFileTemplate.current) {
      return;
    }
    refFileTemplate.current.click();
  };

  const saveTemplate = () => {
    if (!refEditor.current?.editor) {
      return;
    }
    const blob = new Blob([refEditor.current.editor.data.get()]);
    const name = refFilename.current?.value || "tempub";
    saveAs(blob, `${name}.html`);
  };

  const loadData = () => {
    refFileData.current?.click();
  };

  const publish = () => {
    if (!refEditor.current?.editor?.data) {
      return;
    }
    setEditorState(EditorState.Publishing);
    const template = refEditor.current.editor.data.get();
    const templateFunction = dot.template(template);

    const renderList: RenderResult[] = [];
    dataList.forEach((data) => {
      const rendered = templateFunction(data);
      renderList.push({ key: data[metadata.key], rendered });
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
          <a className="button is-text" onClick={loadTemplate}>
            Load template
          </a>
          <input
            type="file"
            ref={refFileTemplate}
            style={{ display: "none" }}
          />
        </div>
        <div className="control">
          <input
            className="input"
            ref={refFilename}
            placeholder="tempub"
          ></input>
        </div>
        <div className="control">
          <a className="button is-text" onClick={saveTemplate}>
            Save template
          </a>
        </div>
        <div className="control">
          <a className="button is-text" onClick={loadData}>
            Load data
          </a>
          <input type="file" ref={refFileData} style={{ display: "none" }} />
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
      />
    </div>
  );
}

export default App;
