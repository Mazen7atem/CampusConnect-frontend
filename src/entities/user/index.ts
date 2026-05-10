export {
  useGetStudentsQuery,
  useLazySearchStudentsQuery,
  useCreateUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} from './api/userApi';

export type {
  Student,
  CreateUserPayload,
  CreateUserResponse,
} from './api/userApi';
