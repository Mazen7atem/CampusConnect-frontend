export {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateRoomMutation,
} from './api/roomApi';

export type {
  Room,
  CreateRoomPayload,
  UpdateRoomPayload,
  Resource,
  CreateResourcePayload,
} from './api/roomApi';
