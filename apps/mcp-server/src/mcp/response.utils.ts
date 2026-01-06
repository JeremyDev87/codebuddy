/**
 * Shared response utilities for MCP services.
 * Centralizes JSON response formatting to ensure consistent behavior.
 */

export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Creates a standardized JSON response for MCP tool calls.
 * Uses compact JSON format to minimize token usage.
 *
 * @param data - The data to serialize as JSON
 * @returns ToolResponse with JSON-serialized content
 */
export function createJsonResponse(data: unknown): ToolResponse {
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
  };
}

/**
 * Creates a standardized error response for MCP tool calls.
 *
 * @param message - The error message to return
 * @returns ToolResponse with isError flag set
 */
export function createErrorResponse(message: string): ToolResponse {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  };
}
