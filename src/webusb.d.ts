interface USBDevice {
  vendorId: number;
  productId: number;
  productName?: string;
  manufacturerName?: string;
  serialNumber?: string;
  open(): Promise<void>;
  close(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
  releaseInterface(interfaceNumber: number): Promise<void>;
  controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
  controlTransferOut(setup: USBControlTransferParameters, data?: BufferSource): Promise<USBOutTransferResult>;
  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
  transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
  clearHalt(direction: "in" | "out", endpointNumber: number): Promise<void>;
}

interface USBControlTransferParameters {
  requestType: "standard" | "class" | "vendor";
  recipient: "device" | "interface" | "endpoint" | "other";
  request: number;
  value: number;
  index: number;
}

interface USBInTransferResult {
  data: DataView;
  status: "ok" | "stall" | "babble";
}

interface USBOutTransferResult {
  status: "ok" | "stall" | "babble";
}

interface Navigator {
  usb: {
    requestDevice(options?: { filters: USBDeviceFilter[] }): Promise<USBDevice>;
    getDevices(): Promise<USBDevice[]>;
  };
}

interface USBDeviceFilter {
  vendorId?: number;
  productId?: number;
}
