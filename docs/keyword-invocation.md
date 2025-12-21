## Summary
Enable automatic MCP invocation by entering specific keywords (PLAN, ACT, EVAL) at the beginning of a prompt.

## Background
Currently, MCP must be explicitly specified for each invocation.
To improve usability, introducing a keyword-based auto-invocation system.

## Feature Details

### Supported Keywords and Modes

| Keyword | Mode | Description |
|---------|------|-------------|
| `PLAN` | Planning Mode | Task planning and design phase |
| `ACT` | Action Mode | Actual task execution phase |
| `EVAL` | Evaluation Mode | Result review and assessment phase |

### Usage
- Enter one keyword at the beginning of the prompt
- Additional prompt text is required after the keyword
- Keywords are mutually exclusive (only one can be selected)

### Examples
```
PLAN Create a work plan for implementing user authentication
```
```
ACT Implement the login API endpoint
```
```
EVAL Review the security of the implemented authentication logic
```

## Expected Benefits
- Improved usability by eliminating explicit MCP specification
- Simplified mode switching for workflow stages

## Tasks
- [x] Implement keyword parsing logic
- [x] Handle MCP connection for each mode
- [x] Add error handling for missing or multiple keywords
- [x] Create usage documentation
