export interface ApiResponse<T> {
    isSuccess: boolean;
    data: T;
    messages: string[];
}