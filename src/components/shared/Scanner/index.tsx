"use client";
import { FC, useEffect, useRef, useState } from "react";

import { Box, Button, Stack, Typography } from "@mui/joy";

import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";

import styles from './styles.module.scss';
import { SearchContainer } from "../SearchContainer";

type Props = {
  onFound: (barcode: string) => void,
}

export const ScanditScanner: FC<Props> = (props) => {
  const { onFound } = props;

  const dataViewRef = useRef<HTMLElement>(null);

  const [cameraStatus, setCameraStatus] = useState<'on' | 'off' | 'loading'>('loading');

  const barcodeCaptureListener = {
    didScan: async (barcodeCapture: SDCBarcode.BarcodeCapture, session: SDCBarcode.BarcodeCaptureSession) => {
      const recognizedBarcodes = session.newlyRecognizedBarcodes;
      const [barcode] = recognizedBarcodes;
      let barcodeValue = barcode.data;
      console.log('barcodeValue', barcodeValue);

      onFound(barcodeValue as string);

      // disable scanning
      await barcodeCapture.setEnabled(false);
      await barcodeCapture.context?.frameSource?.switchToDesiredState(SDCCore.FrameSourceState.Off);
      setCameraStatus('off');
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
    setCameraStatus('loading');
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
    setCameraStatus('on');
  };

  const switchOnCamera = async (camera: SDCCore.Camera) => {
    await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
  }

  useEffect(() => {
    const setUpScanner = async (): Promise<void> => {
      await configureScanner();
    };

    setUpScanner();
  }, []);

  return (
    <Box>
      <Box
        className={styles.canvas_container}
        ref={dataViewRef}
      >
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            height: '100%',
          }}
        >
          <Typography
            component={'span'}
            sx={{
              color: 'white',
            }}
          >
            Loading...
          </Typography>
        </Stack>
      </Box>

      {
        cameraStatus === 'off' &&
        <Box
          className={styles.canvas_container}
        >
          <Stack
            alignItems={'center'}
            justifyContent={'center'}
            sx={{
              height: '100%',
            }}
          >
            <Button
              variant="outlined"
              onClick={async () => {
                await configureScanner();
              }}
              sx={{
                color: 'white',
                borderColor: 'white'
              }}
            >
              Start Scanner
            </Button>
          </Stack>
        </Box>
      }
    </Box>
  )
}