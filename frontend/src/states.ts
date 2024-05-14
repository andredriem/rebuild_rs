import { create } from 'zustand'

type PostIdsState = {
    postId: string | null;
    setPostId: (postId: string) => void;
};

export const usePostId = create<PostIdsState>((set) => ({
    postId: null,
    setPostId: (postId) => set({ postId }),
}));

export type SelectedTool = 'Mouse' | 'Pin'

type SelectedToolState = {
    selectedTool: SelectedTool;
    setSelectedTool: (toolSelected: SelectedTool) => void;
};

export const useSelectedTool = create<SelectedToolState>((set) => ({
    selectedTool: 'Mouse',
    setSelectedTool: (selectedTool) => set({ selectedTool }),
}));

export type PinMarkerRequest = {
    latitude: number,
    longitude: number,
    uuid: string,
}

type PinMarkerRequestState = {
    pinMarkerRequest: PinMarkerRequest | null;
    setPinMarkerRequest: (pinMarkerRequest: PinMarkerRequest | null) => void;
};

export const usePinMarkerRequest = create<PinMarkerRequestState>((set) => ({
    pinMarkerRequest: null,
    setPinMarkerRequest: (pinMarkerRequest) => set({ pinMarkerRequest }),
}));

type UserState = {
    user: string | null;
    setUser: (user: string) => void;
};

export const useUser = create<UserState>((set) => ({
    user: 'test-user',
    setUser: (user) => set({ user }),
}));

type MapRefreshCountState = {
    refreshCount: number;
    setRefreshCount: (count: number) => void;
}

export const useMapRefreshCount = create<MapRefreshCountState>((set) => ({
    refreshCount: 0,
    setRefreshCount: (count) => set({ refreshCount: count }),
}));