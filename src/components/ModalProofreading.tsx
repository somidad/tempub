import { createRef, useEffect, useState } from "react";
import { EditorState, RenderResult } from "../App";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import readerConfig from "../readerConfig";

type Props = {
  onClose?: () => void;
  editorState?: EditorState;
  renderList: RenderResult[];
  KEY: string;
};

export default function ModalProofreading({
  onClose,
  editorState,
  renderList,
  KEY,
}: Props) {
  const [keyIndex, setKeyIndex] = useState(-1);
  const refReader = createRef<CKEditor<ClassicEditor>>();

  useEffect(() => {
    setKeyIndex(-1);
  }, [editorState]);

  const onChangeKeyIndex = (keyIndex: number) => {
    setKeyIndex(keyIndex);
    refReader.current?.editor?.data.set(renderList[keyIndex].rendered);
  };

  const isActive =
    editorState === EditorState.Publishing ||
    editorState === EditorState.Displaying
      ? "is-active"
      : "";

  const matchedKeysList = renderList.map((render) => {
    const matchedKeys = renderList
      .filter(
        (toFilter) =>
          (toFilter as any)[KEY] !== (render as any)[KEY] &&
          toFilter.rendered === render.rendered
      )
      .map((toMap) => (toMap as any)[KEY]);
    return matchedKeys;
  });

  return (
    <div className={`modal ${isActive}`}>
      <div className="modal-background" onClick={onClose}></div>
      {editorState === EditorState.Publishing && (
        <div className="modal-content">
          <progress className="progress" max="100"></progress>
        </div>
      )}
      {editorState === EditorState.Displaying && (
        <div
          className="modal-card"
          style={{
            width: "calc(100vw - 40px)",
            height: "calc(100vh - 40px)",
          }}
        >
          <div className="modal-card-head">
            <div className="modal-card-title">Proofreading</div>
          </div>
          <div className="modal-card-body">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="menu">
                <ul className="menu-list">
                  {renderList.map((render, index) => (
                    <li key={(render as any)[KEY]}>
                      <a
                        className={index === keyIndex ? "is-active" : ""}
                        onClick={() => onChangeKeyIndex(index)}
                      >
                        {(render as any)[KEY]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ flexGrow: "1" }}>
                <div className="tags">
                  Matched keys: {matchedKeysList[keyIndex]?.join(", ")}
                </div>
                <div className="content">
                  <CKEditor
                    editor={ClassicEditor}
                    config={readerConfig}
                    ref={refReader}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-card-foot"></div>
        </div>
      )}
    </div>
  );
}
