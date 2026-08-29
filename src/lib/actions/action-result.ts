export type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export function actionError(error: unknown, fallback: string): ActionResult<never> {
    console.error(fallback, error instanceof Error ? error.message : "Unknown server error");
    return { success: false, error: fallback };
}
