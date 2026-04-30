export interface MessageProps {
  text: string;
  isMine: boolean;
  createdAt: string | Date;
  user?: {
    name: string;
    avatar?: string;
    color?: string;
  };
}
