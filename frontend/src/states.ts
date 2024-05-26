import { create } from 'zustand'
import { BrowserView, MobileView, isBrowser, isMobile, isTablet } from 'react-device-detect';

export const showMobile = isMobile && !isTablet;

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

type ShowLayerModalState = {
    showLayerModal: boolean;
    setShowLayerModal: (showLayerModal: boolean) => void;
};

export const useShowLayerModal = create<ShowLayerModalState>((set) => ({
    showLayerModal: false,
    setShowLayerModal: (showLayerModal) => set({ showLayerModal }),
}));

export type LayerType = 'default' | 'topo' | 'satellite';

type CurrentLayerState = {
    currentLayer: LayerType;
    setCurrentLayer: (currentLayer: LayerType) => void;
};

export const useCurrentLayer = create<CurrentLayerState>((set) => ({
    currentLayer: 'default',
    setCurrentLayer: (currentLayer: LayerType) => set({ currentLayer }),
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
if (isNaN(initialPostId) || initialPostId <= 0) {
    initialPostId = null;
}

export const usePostId = create<PostIdsState>((set) => ({
    postId: initialPostId?.toString() ?? null,
    setPostId: (postId) => set({ postId }),
}));

export type SelectedTool = 'Mouse' | 'Pin' | 'ChangePin'

type SelectedToolState = {
    selectedTool: SelectedTool;
    setSelectedTool: (toolSelected: SelectedTool) => void;
};

export const useSelectedTool = create<SelectedToolState>((set) => ({
    selectedTool: 'Mouse',
    setSelectedTool: (selectedTool) => set({ selectedTool }),
}));

export type ChangePinSelectedTopicIdState = {
    changePinSelectedTopicId: string | null;
    setChangePinSelectedTopicId: (topicId: string | null) => void;
};

export const useChangePinSelectedTopicId = create<ChangePinSelectedTopicIdState>((set) => ({
    changePinSelectedTopicId: null,
    setChangePinSelectedTopicId: (topicId) => set({ changePinSelectedTopicId: topicId }),
}));

export type changeGenereicErrorState = {
    changeGenericError: string | null;
    setChangeGenericError: (error: string | null) => void;
};

export const useChangeGenericError = create<changeGenereicErrorState>((set) => ({
    changeGenericError: null,
    setChangeGenericError: (error) => set({ changeGenericError: error }),
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

type OpenTopicState = {
    openTopic: boolean
    setOpenTopic: (openTopic: boolean) => void;
};

export const useOpenTopic = create<OpenTopicState>((set) => ({
    openTopic: false,
    setOpenTopic: (openTopic) => set({ openTopic }),
}));