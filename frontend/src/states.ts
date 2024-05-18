import { create } from 'zustand'

export type LoginData = {
    username: string;
    userId: string;
    avatarTemplate: string | null;
    email: string;
} | null

type LoginDataState = {
    loginData: LoginData | null;
    setLoginData: (loginData: LoginData) => void;
};

export const useLoginData = create<LoginDataState>((set) => ({
    loginData: null,
    setLoginData: (loginData) => set({ loginData }),
}));

type ShowLoginModalState = {
    showLoginModal: boolean;
    setShowLoginModal: (showLoginModal: boolean) => void;
};

export const useShowLoginModal = create<ShowLoginModalState>((set) => ({
    showLoginModal: false,
    setShowLoginModal: (showLoginModal: boolean) => set({ showLoginModal }),
}));

type PostIdsState = {
    postId: string | null;
    setPostId: (postId: string) => void;
};

let initialPostId: number | null = parseInt(new URLSearchParams(window.location.search).get('post_id') ?? '15');
if(isNaN(initialPostId) || initialPostId <= 0) {
  initialPostId = null;
}

export const usePostId = create<PostIdsState>((set) => ({
    postId: initialPostId?.toString() ?? null,
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


type TriggerLoginCheckCounterState = {
    triggerLoginCheckCounter: number;
    setTriggerLoginCheckCounter: (count: number) => void;
}

export const useTriggerLoginCheckCounter = create<TriggerLoginCheckCounterState>((set) => ({
    triggerLoginCheckCounter: 0,
    setTriggerLoginCheckCounter: (count) => set({ triggerLoginCheckCounter: count }),
}));