export interface KAKAOOauthRes {
  access_token: string;
  token_type: "bearer";
  refresh_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export interface KAKAOUserRes {
  id: number;
  connected_at: string; // ex)"2025-12-29T09:42:40Z";
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    email: string;
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
      is_default_nickname: boolean;
    };
  };
}
