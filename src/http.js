const REQUEST_TIMEOUT = Number(
    process.env.REQUEST_TIMEOUT || 10000
);

export async function fetchWithTimeout(
    url,
    timeoutMs = REQUEST_TIMEOUT
) {
    let response;

    try {
        response = await fetch(url, {
            signal: AbortSignal.timeout(timeoutMs)
        });

    } catch (error) {

        if (
            error.name === "TimeoutError" ||
            error.name === "AbortError"
        ) {
            throw new Error(
                "Request timed out. Please try again."
            );
        }

        if (error instanceof TypeError) {
            throw new Error(
                "Network error. Check your internet connection and try again."
            );
        }

        throw error;
    }

    if (!response.ok) {
        throw new Error(
            `Weather service error (HTTP ${response.status}). Please try again later.`
        );
    }

    return response;
}