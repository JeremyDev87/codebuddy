# Add AI/ML Engineer Primary Agent

## 📋 Summary

This PR introduces a comprehensive AI/ML Engineer Primary Agent specializing in LLM integration, RAG architecture, prompt engineering, and AI safety. The agent provides structured frameworks for planning, implementation, and evaluation of AI/ML features, with mandatory safety checklists and best practices. This enables consistent, secure, and high-quality AI development across the codebase.

## 🎯 Motivation

- **AI Development Expertise**: Provide specialized guidance for LLM integration, RAG, and prompt engineering tasks
- **Safety-First Approach**: Enforce AI safety best practices (prompt injection prevention, output validation, PII handling)
- **Provider Flexibility**: Support multiple LLM providers (OpenAI, Anthropic, Google, AWS, Azure, local models)
- **Quality Assurance**: Ensure proper testing strategies for non-deterministic AI outputs
- **Cost Optimization**: Guide token management and cost optimization strategies
- **Standardization**: Establish consistent patterns and frameworks for AI development

## 🔧 Key Changes

### 1. AI/ML Engineer Agent Definition

**New Agent: `ai-ml-engineer.json`**

- **Type**: Primary Agent (activated for PLAN/ACT workflows)
- **Expertise**: LLM integration, RAG architecture, prompt engineering, AI safety, testing strategies
- **Model Preference**: Claude Sonnet 4 (optimized for AI/ML development)

**Supported Providers:**

- **Cloud**: OpenAI, Anthropic, Google (Gemini), AWS Bedrock, Azure OpenAI
- **Local**: Ollama, llama.cpp, vLLM, HuggingFace Transformers
- **Vector DBs**: Pinecone, Weaviate, ChromaDB, pgvector, Milvus, Qdrant

### 2. Mandatory Safety Checklist

**Critical Requirements:**

- **AI Safety**: Prompt injection prevention, output validation, PII handling
- **Provider Abstraction**: Unified interface for multiple LLM providers
- **Type Safety**: TypeScript strict mode (no `any`) for all AI/ML code
- **Test Coverage**: 90%+ coverage with non-deterministic testing strategies
- **Error Handling**: Proper retry logic with fallbacks and graceful degradation

**Verification Guide:**

Each checklist item includes detailed verification steps and cross-references to shared frameworks.

### 3. Shared Frameworks

**LLM Integration Patterns:**

- Provider abstraction (Factory, Adapter, Strategy patterns)
- Error handling (exponential backoff, rate limiting, fallback chains)
- Streaming responses (SSE, AsyncIterable, chunked processing)
- Context management (token counting, window optimization, history management)

**Prompt Engineering:**

- Type-safe template design with validation
- System prompt structure and versioning
- Techniques (chain-of-thought, few-shot, structured output)

**RAG Architecture:**

- Document processing (chunking strategies: fixed-size, semantic, hierarchical)
- Embedding model selection and considerations
- Retrieval strategies (similarity search, MMR, hybrid)
- Reranking and context assembly

**AI Safety:**

- Prompt injection prevention (input sanitization, delimiter strategy, pattern detection)
- Output validation (format validation, content filtering, hallucination mitigation)
- Data protection (PII handling, logging safety, data retention)
- Reference: OWASP LLM Top 10

**AI Testing Strategies:**

- Non-deterministic testing (format validation, semantic similarity, golden datasets, statistical validation)
- Mock strategies (CI/CD mocking, snapshot testing)
- Evaluation metrics (quality, safety, performance)

### 4. Mode-Specific Frameworks

**PLAN Mode:**

- LLM architecture planning (provider abstraction, error handling, streaming)
- AI safety planning (prompt injection, output validation, PII)
- RAG architecture planning (chunking, embedding, retrieval)
- Test strategy planning (non-deterministic testing, mock strategies)
- Risk assessment (Critical/High/Medium/Low)

**ACT Mode:**

- LLM integration verification (provider abstraction, retry logic, streaming)
- AI safety verification (prompt injection prevention, output validation)
- RAG verification (chunking, embedding, retrieval quality)
- Test verification (non-deterministic test strategies)
- Implementation risk assessment

**EVAL Mode:**

- Prompt injection review
- Output safety review
- PII handling review
- Error handling review
- Cost efficiency review
- Test strategy review
- Quality metrics (response quality, performance metrics)

### 5. Activation Patterns

**Trigger Conditions:**

- LLM integration planning or implementation
- RAG architecture design or implementation
- Prompt engineering tasks
- AI safety review requests
- AI feature code changes

**File Pattern Triggers:**

- `**/*.llm.ts`, `**/*.prompt.ts`, `**/*.rag.ts`
- `**/*.embedding.ts`, `**/*.ai.ts`
- `**/llm/**`, `**/rag/**`, `**/prompts/**`
- `**/embeddings/**`, `**/ai/**`
- `**/langchain/**`, `**/openai/**`, `**/anthropic/**`

**Activation Rule:**

🔴 **STRICT**: This Agent MUST be activated when AI/ML development is needed or when files match file_pattern_triggers

### 6. Schema Enhancements

**Agent Schema Updates:**

- **Model Field**: Added `model` object with `preferred` and `reason` fields
- **Role Type**: Added `type` enum field (`primary` | `specialist`) with description
- **Workflow Integration**: Enhanced schema with detailed properties:
  - `trigger_conditions`: Semantic conditions for activation
  - `file_pattern_triggers`: Glob patterns for file-based activation
  - `activation_rule`: Rule describing when agent must be activated
  - `output_format`: Expected output format

### 7. Documentation Updates

**README.md Updates:**

- Added AI/ML Engineer to agent summary table
- Added expertise description
- Added activation patterns (Korean and English)
- Added to Primary Agents list
- Added comprehensive agent documentation section

## ⚠️ Breaking Changes

**None** - All changes are additive. Existing agents and workflows continue to work unchanged.

## 📌 Impact Analysis

### Before This PR

- **No AI/ML Specialization**: General agents handled AI/ML tasks without specialized guidance
- **Inconsistent Patterns**: No standardized approach to LLM integration or RAG architecture
- **Safety Gaps**: No mandatory safety checklists for AI development
- **Testing Challenges**: No guidance for testing non-deterministic AI outputs

### After This PR

- **Specialized Guidance**: Dedicated agent for AI/ML development tasks
- **Standardized Patterns**: Consistent frameworks for LLM integration, RAG, and prompt engineering
- **Safety Enforcement**: Mandatory checklists ensure AI safety best practices
- **Testing Support**: Comprehensive strategies for non-deterministic testing

### Benefits

1. **Safety**: Mandatory AI safety checklists prevent common vulnerabilities
2. **Quality**: Structured frameworks ensure high-quality AI implementations
3. **Consistency**: Standardized patterns across all AI/ML development
4. **Efficiency**: Clear guidance reduces development time and errors
5. **Cost Optimization**: Built-in token management and cost optimization strategies

## 🔍 Implementation Details

### Agent Architecture

**Primary Agent Type:**

- Activated automatically for PLAN/ACT workflows when AI/ML context detected
- Uses top-level activation (not specialist mode)
- Provides comprehensive frameworks for all AI/ML development phases

**Workflow Integration:**

- **PLAN Mode**: Architecture planning with safety considerations
- **ACT Mode**: Implementation verification with mandatory checklists
- **EVAL Mode**: Quality assessment with risk analysis

### Safety Framework

**Prompt Injection Prevention:**

- Input sanitization (strip control characters, escape special tokens)
- Delimiter strategy (unique delimiters between system/user content)
- Pattern detection (detect common injection patterns)
- Output filtering (validate output doesn't contain system prompt)

**Output Validation:**

- Format validation (JSON schema, type checking)
- Content filtering (harmful, biased, inappropriate content)
- Hallucination mitigation (grounding in context, confidence scoring)
- PII detection (scan outputs before returning)

**Data Protection:**

- PII handling (mask or redact in prompts)
- Logging safety (never log full prompts/responses with PII)
- Data retention (clear conversation history appropriately)

### Testing Strategies

**Non-Deterministic Testing:**

- **Format Validation**: Validate structure without exact matching
- **Semantic Similarity**: Compare meaning with embedding similarity (>0.85 threshold)
- **Golden Dataset**: Human-curated expected outputs with tolerance
- **Statistical Validation**: Validate distribution over multiple runs

**Mock Strategies:**

- **CI/CD Mocking**: Deterministic responses for pipelines (MSW, nock)
- **Snapshot Testing**: Capture and compare prompt structures

### Cost Optimization

**Token Management:**

- Token counting (provider-specific tokenizers)
- Context window optimization
- Conversation history management (sliding window, summarization)

**Optimization Strategies:**

- Caching strategies
- Model selection based on task complexity
- Batch processing where applicable
- Cost monitoring and limits

## ✅ Testing

### Agent Definition

- ✅ Schema validation passes
- ✅ All required fields present
- ✅ Activation patterns defined
- ✅ File pattern triggers configured
- ✅ Mandatory checklists complete

### Documentation

- ✅ README updated with agent information
- ✅ Activation patterns documented (Korean and English)
- ✅ Schema enhancements documented
- ✅ Cross-references to related specialists

## 📚 Documentation Updates

### New Documentation

- **ai-ml-engineer.json**: Comprehensive agent definition (802 lines)
- **README.md**: Agent summary, expertise, activation patterns

### Schema Updates

- **agent.schema.json**: Model field, role type, workflow integration enhancements

## 🔗 Related

- Closes #173
- Enables specialized AI/ML development guidance
- Establishes safety-first AI development practices
- Provides comprehensive frameworks for LLM/RAG development
- Supports multiple AI providers and vector databases
