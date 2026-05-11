import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────
export interface Room {
  id: number;
  name: string | number;
  room_number: number;
  building_name: string;
  capacity: number;
  type: string;
  status: 'available' | 'maintenance';
  start_time: number;
  end_time: number;
  resources: string[];
}

export interface CreateRoomPayload {
  room_number: number;
  building_name: string;
  capacity: number;
  type: string;
  start_time: number;
  end_time: number;
  resources_ids: number[];
}

export interface Resource {
  resource_id: number;
  name: string;
}

export interface CreateResourcePayload {
  name: string;
}

export interface UpdateRoomPayload {
  id: number;
  room_number?: number;
  building_name?: string;
  capacity?: number;
  type?: string;
  start_time?: number;
  end_time?: number;
  is_available?: boolean;
  resources_ids?: number[];
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/rooms */
    getRooms: builder.query<Room[], void>({
      query: () => 'api/rooms',
      providesTags: ['Room'],
    }),

    /** POST /api/admin/rooms */
    createRoom: builder.mutation<Room, CreateRoomPayload>({
      query: (body) => ({
        url: 'api/admin/rooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Room'],
    }),

    /** GET /api/rooms/resources */
    getResources: builder.query<Resource[], void>({
      query: () => 'api/rooms/resources',
      providesTags: ['Resource'],
    }),

    /** POST /api/rooms/resources */
    createResource: builder.mutation<Resource, CreateResourcePayload>({
      query: (body) => ({
        url: 'api/rooms/resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Resource'],
    }),

    /** PATCH /api/rooms/:id — admin only */
    updateRoom: builder.mutation<void, UpdateRoomPayload>({
      query: ({ id, ...body }) => ({
        url: `api/rooms/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Room'],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useGetResourcesQuery,
  useCreateResourceMutation,
  useUpdateRoomMutation,
} = roomApi;
