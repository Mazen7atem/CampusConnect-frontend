export {
  useGetStudentsQuery,
  useLazySearchStudentsQuery,
  useCreateUserMutation,
  useBanUserMutation,
} from './api/userApi';

export type {
  Student,
  CreateUserPayload,
  CreateUserResponse,
} from './api/userApi';
