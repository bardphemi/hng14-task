export interface TokenDto {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string | Date;
};
