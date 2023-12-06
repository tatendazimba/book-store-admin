"use client";
import { FC, useEffect, useRef } from "react";

import { Box } from "@mui/joy";

import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";

import styles from './styles.module.scss';

export const ScanditScanner: FC = () => {
  const dataViewRef = useRef<HTMLElement>(null);

  const barcodeCaptureListener = {
    didScan: async (barcodeCapture: SDCBarcode.BarcodeCapture, session: SDCBarcode.BarcodeCaptureSession) => {
      const recognizedBarcodes = session.newlyRecognizedBarcodes;
      const [barcode] = recognizedBarcodes;
      let barcodeValue = barcode.data;

      console.log('barcodeValue', barcodeValue);

      // disable scanning
      // await barcodeCapture.setEnabled(false);
      // await barcodeCapture.context?.frameSource?.switchToDesiredState(SDCCore.FrameSourceState.Off);
    }
  };

  const initialiseScanner = async (): Promise<void> => {
    const sdcCoreConfiguration: SDCCore.ConfigureOptions = {
      licenseKey: process.env.NEXT_PUBLIC_SCANDIT_API_KEY as string,
      libraryLocation: process.env.NEXT_PUBLIC_SCANDIT_LIBRARY_LOCATION as string,
      moduleLoaders: [
        SDCBarcode.barcodeCaptureLoader({
          highEndBlurryRecognition: false
        })
      ]
    };

    await SDCCore.configure(sdcCoreConfiguration);
  }

  const createContext = async () => {
    const context = await SDCCore.DataCaptureContext.create();

    return context;
  }

  const createBarcodeCaptureSettings = async () => {
    const settings = new SDCBarcode.BarcodeCaptureSettings();

    settings.codeDuplicateFilter = -1;
    settings.enableSymbologies([
      SDCBarcode.Symbology.EAN13UPCA,
    ]);

    return settings;
  }

  const createBarcodeCapture = async (context: SDCCore.DataCaptureContext, barcodeCaptureSettings: SDCBarcode.BarcodeCaptureSettings, barcodeCaptureListener: SDCBarcode.BarcodeCaptureListener) => {
    const barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(context, barcodeCaptureSettings);
    barcodeCapture.addListener(barcodeCaptureListener);

    return barcodeCapture;
  }

  const createCamera = async () => {
    const cameraSettings = SDCBarcode.BarcodeCapture.recommendedCameraSettings;
    const camera = SDCCore.Camera.default;

    if (camera) {
      await camera.applySettings(cameraSettings);
    }

    return camera;
  }

  const createView = async (barcodeCapture: SDCBarcode.BarcodeCapture, context: SDCCore.DataCaptureContext, canvasElement: HTMLElement) => {
    const view = await SDCCore.DataCaptureView.forContext(context);

    view.connectToElement(canvasElement);

    await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForView(barcodeCapture, view);

    return view;
  }

  const setFrameSourceForContext = async (context: SDCCore.DataCaptureContext, camera: SDCCore.Camera) => {
    await context.setFrameSource(camera);
  }

  const configureScanner = async (): Promise<void> => {
    // TODO this is a slow process and should be moved out of this component
    await initialiseScanner();

    const context = await createContext();

    const barcodeCaptureSettings = await createBarcodeCaptureSettings();

    const barcodeCapture = await createBarcodeCapture(context, barcodeCaptureSettings, barcodeCaptureListener);

    const camera = await createCamera();

    await setFrameSourceForContext(context, camera);

    const canvasElement = dataViewRef.current;
    await createView(barcodeCapture, context, canvasElement as HTMLElement);

    await switchOnCamera(camera);
  };

  const switchOnCamera = async (camera: SDCCore.Camera) => {
    await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
  }

  useEffect(() => {
    const setUpScanner = async (): Promise<void> => {
      console.log('setUpScanner')
      await configureScanner();
    };

    setUpScanner();
  }, []);

  return (
    <Box
    >
      <Box
        className={styles.canvas_container}
        ref={dataViewRef}
      />
    </Box>
    
  )
}