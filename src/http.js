export async function fetchWithTimeout(url, timeoutMs = 10000) {
    let response;

    try {
        // Send HTTP request with a timeout
        response = await fetch(url, {
            signal: AbortSignal.timeout(timeoutMs)
        });

    } catch (error) {

        // Handle timeout errors
        if (
            error.name === "TimeoutError" ||
            error.name === "AbortError"
        ) {
            throw new Error(
                "Request timed out. Please try again."
            );
        }

        // Handle network errors
        if (error instanceof TypeError) {
            throw new Error(
                "Network error. Check your internet connection and try again."
            );
        }

        // Handle unexpected errors
        throw error;
    }

    // Handle unsuccessful HTTP responses
    if (!response.ok) {
        throw new Error(
            `Weather service error (HTTP ${response.status}). Please try again later.`
        );
    }

    return response;
}