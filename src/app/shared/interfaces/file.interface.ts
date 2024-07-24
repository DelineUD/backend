export enum EFileType {
  Image = 'image',
  Video = 'video',
}

export interface IFile {
  type: EFileType;
  url: string;
}
