import React, { Component, useRef, useState } from "react";
import { render } from "react-dom";

import {
  Modal,
  ModalDialog,
  Typography,
  Textarea,
  ModalClose,
  Button,
} from "@mui/joy";

import { Pannellum } from "pannellum-react";
import "./pannelum.css";
import "@fontsource/inter";


const PannellumReact = () => {
  const pannellumRef = useRef(null);
  const fileInputRef = useRef(null);
  const [panoramaImage, setPanoramaImage] = useState("");

  const [isHotSpotModalVisible, setIsHotSpotModalVisible] = useState(false);

  const [markerDesc, setMarkerDesc] = useState("");

  const [newMarkerCoords, setNewMarkerCoords] = useState({});

  const getPitchAndYawByMouseEvent = (e) => {
    return pannellumRef.current.panorama.mouseEventToCoords(e);
  };

  const addNewHotSpot = (e) => {
    if (!newMarkerCoords.pitch || !newMarkerCoords.yaw) {
      const [pitch, yaw] = getPitchAndYawByMouseEvent(e);
      newMarkerCoords.pitch = pitch;
      newMarkerCoords.yaw = yaw;
    }

    pannellumRef.current.panorama.addHotSpot({
      type: "info",
      pitch: newMarkerCoords.pitch,
      yaw: newMarkerCoords.yaw,
      text: markerDesc,
    });
    closeAddHotSpotModal();
  };

  const showAddHotSpotModal = (e) => {
    const isRightButtonClicked = e.which === 3;
    if (isRightButtonClicked) {
      setIsHotSpotModalVisible(true);
      const [pitch, yaw] = getPitchAndYawByMouseEvent(e);
      setNewMarkerCoords({
        pitch,
        yaw,
      });
    }
  };

  const closeAddHotSpotModal = () => {
    setIsHotSpotModalVisible(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setPanoramaImage(URL.createObjectURL(selectedFile));
  };

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <Modal open={isHotSpotModalVisible}>
        <ModalDialog>
          <ModalClose onClick={closeAddHotSpotModal} />
          <Typography level="h2">Add new marker</Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (markerDesc) {
                addNewHotSpot();
              }
            }}
          >
            <Typography>Description</Typography>
            <Textarea
              minRows={2}
              required
              onChange={(event) => setMarkerDesc(event.target.value)}
            />
            <Button type="submit" style={{ marginTop: "12px" }}>
              Add
            </Button>
          </form>
        </ModalDialog>
      </Modal>

      <Button
        style={{ marginBottom: "12px" }}
        type="file"
        onClick={() => fileInputRef.current.click()}
      >
        Load Panorama Image
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Pannellum
        width="700px"
        height="500px"
        pitch={10}
        yaw={180}
        image={panoramaImage}
        hfov={110}
        preview=""
        autoLoad
        previewAuthor=""
        previewTitle=""
        onLoad={() => {
          console.log("panorama loaded");
        }}
        onMousedown={showAddHotSpotModal}
        ref={pannellumRef}
      ></Pannellum>
    </div>
  );
};

export default PannellumReact;
