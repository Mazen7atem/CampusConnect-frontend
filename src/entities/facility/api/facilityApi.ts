import { baseApi } from '@/shared/api';

// ─── Types ───────────────────────────────────────────────────────────
export interface Facility {
  facility_id: number;
  name: string;
  type: string;
  location_description: string;
  min_capacity: number;
  max_capacity: number;
  status: 'available' | 'closed' | 'under_maintenance';
}

export interface CreateFacilityPayload {
  name: string;
  location: string;
  min_capacity: number;
  max_capacity: number;
  type: string;
  status?: 'available' | 'closed' | 'under_maintenance';
}

export interface UpdateFacilityPayload {
  id: number;
  name?: string;
  location?: string;
  min_capacity?: number;
  max_capacity?: number;
  type?: string;
  status?: 'available' | 'closed' | 'under_maintenance';
}

// ─── Injected Endpoints ──────────────────────────────────────────────
const facilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /api/facilities */
    getFacilities: builder.query<Facility[], void>({
      query: () => 'api/facilities',
      providesTags: ['Facility'],
    }),

    /** POST /api/admin/facilities */
    createFacility: builder.mutation<void, CreateFacilityPayload>({
      query: (body) => ({
        url: 'api/admin/facilities',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Facility'],
    }),

    /** PATCH /api/facilities/:id — admin only */
    updateFacility: builder.mutation<void, UpdateFacilityPayload>({
      query: ({ id, ...body }) => ({
        url: `api/facilities/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Facility'],
    }),
  }),
});

export const {
  useGetFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
} = facilityApi;
