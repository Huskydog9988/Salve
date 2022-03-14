import { QuaggaJSResultObject_CodeResult } from "@ericblade/quagga2";
import { MutableRefObject } from "react";

export type onDetectedType = (
  code: QuaggaJSResultObject_CodeResult["code"]
) => void;

export type onScannerReady = () => void;

export interface DefaultConstraints {
  width: number;
  height: number;
}

export interface DefaultLocatorSettings {
  patchSize: "small" | "medium" | "large";
  halfSample: boolean;
}

export interface ScannerProps {
  onDetected: onDetectedType;
  scannerRef: MutableRefObject<Element | string | undefined>;
  onScannerReady?;
  cameraId?: string;
  facingMode?: string;
  constraints?: DefaultConstraints;
  locator?: DefaultLocatorSettings;
  numOfWorkers?: number;
  decoders?: string[];
  locate?: boolean;
}
