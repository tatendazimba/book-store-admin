export const request = async (method: string, url: string, body: any, signal: AbortSignal) => {
    try {
        const response = await fetch(url,   {
            method,
            cache: "force-cache",
            headers: {
            "Content-Type": "application/json",
            },
            ...body && { body: JSON.stringify(body) },
            ...signal && { signal },
        });
        
        return response.json();
    } catch (error: any) {
        if (error.name === "AbortError") {
            return;
        } else {
            throw error;
        }
    }
}