export enum FullfillmentType {
  DELIVERY = 10,
  CASH_COLLECTION = 15,
  EXCHANGE = 30,
  RETURN = 25,
}
export type PackageSize = "SMALL" | "MEDIUM" | "LARGE";
export type PackageType = "Parcel" | "Document";

export type PackageSpecs = {
  packageType: PackageType;
  size: PackageSize;
  packageDetails: {
    itemsCount: number;
    description: string;
  };
};
export type Address = {
  city: string;
  zoneId?: string;
  districtId: string;
  firstLine: string;
  secondLine?: string;
  buildingNumber?: string;
  floor?: string;
  apartment?: string;
};
export type BostaCreateFullfillmentPayload = {
  type: FullfillmentType;
  specs?: PackageSpecs;
  returnSpecs?: PackageSpecs;
  notes?: string;
  returnNotes?: string;
  cod: number;
  businessReference?: string;
  uniqueBusinessReference?: string;
  allowToOpenPackage?: boolean;
  receiver: {
    firstName: string;
    lastName?: string;
    fullName?: string;
    phone: string;
    email?: string;
  };
  dropOffAddress: Address;
  pickupAddress: Address;
  returnAddress: Address;
  webhookUrl?: string;
  businessLocationId?: string;
  productInfo?: {
    _id: string;
    quantity: number;
    productType: "forward" | "return";
  };
};

export type BostaCreateFullfillmentResponse = {
  _id: string;
  trackingNumber: string;
  businessReference: string;
  sender: {
    _id: string;
    phone: number;
    name: string;
    type: string;
  };
  message: string;
  state: { code: number; value: string };
  creationSrc: string;
};
