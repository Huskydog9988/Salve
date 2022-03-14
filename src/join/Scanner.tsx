import React, { useCallback, useLayoutEffect } from "react";
import Quagga, {
  QuaggaJSResultObject,
  QuaggaJSResultObject_CodeResult,
} from "@ericblade/quagga2";
import {
  DefaultConstraints,
  DefaultLocatorSettings,
  ScannerProps,
} from "./scannerTypes";

function getMedian(arr: number[]) {
  if (undefined) return 0;

  arr.sort((a, b) => a - b);
  const half = Math.floor(arr.length / 2);
  if (arr.length % 2 === 1) {
    return arr[half];
  }
  return (arr[half - 1] + arr[half]) / 2;
}

function getMedianOfCodeErrors(
  decodedCodes: QuaggaJSResultObject_CodeResult["decodedCodes"]
) {
  const errors = decodedCodes
    .filter((x) => x.error !== undefined)
    .map((x) => x.error);
  // errors are filtered out above
  const medianOfErrors = getMedian(errors as number[]);
  return medianOfErrors;
}

const defaultConstraints: DefaultConstraints = {
  width: 640,
  height: 480,
};

const defaultLocatorSettings: DefaultLocatorSettings = {
  patchSize: "medium",
  halfSample: true,
};

const defaultDecoders = ["code_39_reader", "code_39_vin_reader"];

const Scanner = ({
  onDetected,
  scannerRef,
  onScannerReady,
  cameraId,
  facingMode,
  constraints = defaultConstraints,
  locator = defaultLocatorSettings,
  numOfWorkers = navigator.hardwareConcurrency || 0,
  decoders = defaultDecoders,
  locate = true,
}: ScannerProps) => {
  const errorCheck = useCallback(
    (result: QuaggaJSResultObject) => {
      if (
        !onDetected ||
        result === undefined ||
        result.codeResult === undefined
      ) {
        return;
      }

      const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      // if Quagga is at least 75% certain that it read correctly, then accept the code.
      if (err < 0.25) {
        onDetected(result.codeResult.code);
      }
    },
    [onDetected]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleProcessed = (result: QuaggaJSResultObject) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.font = "24px Arial";
    drawingCtx.fillStyle = "green";

    if (result) {
      // console.warn('* quagga onProcessed', result);
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width") as string),
          parseInt(drawingCanvas.getAttribute("height") as string)
        );
        result.boxes
          .filter((box) => box !== result.box)
          .forEach((box) => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: "purple",
              lineWidth: 2,
            });
          });
      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: "blue",
          lineWidth: 2,
        });
      }
      if (result.codeResult && result.codeResult.code) {
        // const validated = barcodeValidator(result.codeResult.code);
        // const validated = validateBarcode(result.codeResult.code);
        // Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: validated ? 'green' : 'red', lineWidth: 3 });
        drawingCtx.font = "24px Arial";
        // drawingCtx.fillStyle = validated ? 'green' : 'red';
        // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
        drawingCtx.fillText(result.codeResult.code, 10, 20);
        // if (validated) {
        onDetected(result.codeResult.code);
        // }
      }
    }
  };

  useLayoutEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            ...constraints,
            ...(cameraId && { deviceId: cameraId }),
            ...(!cameraId && { facingMode }),
          },
          target: scannerRef.current,
        },
        locator,
        numOfWorkers,
        decoder: { readers: decoders, multiple: true },
        locate,
      },
      (err) => {
        Quagga.onProcessed(handleProcessed);
        Quagga.onProcessed((af) => {});

        if (err) {
          return console.log("Error starting Quagga:", err);
        }
        if (scannerRef && scannerRef.current) {
          Quagga.start();
          if (onScannerReady) {
            onScannerReady();
          }
        }
      }
    );
    Quagga.onDetected(errorCheck);
    return () => {
      Quagga.offDetected(errorCheck);
      Quagga.offProcessed(handleProcessed);
      Quagga.stop();
    };
  }, [
    cameraId,
    onDetected,
    onScannerReady,
    scannerRef,
    errorCheck,
    constraints,
    locator,
    decoders,
    locate,
    facingMode,
    numOfWorkers,
    handleProcessed,
  ]);
  return null;
};

// Scanner.propTypes = {
//   onDetected: PropTypes.func.isRequired,
//   scannerRef: PropTypes.object.isRequired,
//   onScannerReady: PropTypes.func,
//   cameraId: PropTypes.string,
//   facingMode: PropTypes.string,
//   constraints: PropTypes.object,
//   locator: PropTypes.object,
//   numOfWorkers: PropTypes.number,
//   decoders: PropTypes.array,
//   locate: PropTypes.bool,
// };

export default Scanner;
