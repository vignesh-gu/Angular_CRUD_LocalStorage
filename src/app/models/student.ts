
export interface Student {
    map(arg0: (std: any) => void): unknown;
    id: number,
    name: String,
    mobile: number,
    email: string
}

export enum FormMode {
    Add = 'Add',
    Update = 'Update'
  }
  