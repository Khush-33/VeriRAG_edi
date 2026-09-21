# Design

## UI structure

The app is organized as a tabbed dashboard:

- Home
- Documents
- Chat
- Report
- Benchmark

This is wired in [src/App.tsx](../src/App.tsx#L18-L157).

## Main user workflows

1. Upload or reset a document.
2. View document list and chunk totals.
3. Ask a verification question.
4. Inspect the retrieved evidence and claim-level verdicts.
5. Run benchmark comparisons.

## Component responsibilities

- [src/components/HomeView.tsx](../src/components/HomeView.tsx): landing page and app overview.
- [src/components/KnowledgeBase.tsx](../src/components/KnowledgeBase.tsx): upload and document management UI.
- [src/components/ChatView.tsx](../src/components/ChatView.tsx): user question and response experience.
- [src/components/VerificationReport.tsx](../src/components/VerificationReport.tsx): evidence + verdict report.
- [src/components/BenchmarkView.tsx](../src/components/BenchmarkView.tsx): research benchmark display.

## Loading, empty, success, and error states

- Loading: represented by the query and benchmark loading flags in [src/App.tsx](../src/App.tsx#L20-L31).
- Empty state: no documents available in [src/components/KnowledgeBase.tsx](../src/components/KnowledgeBase.tsx).
- Success: API response sets current response and document list refreshes.
- Error: queryError is shown in [src/App.tsx](../src/App.tsx#L117-L128).
- Upload, sample loading, deletion, query, and benchmark failures use the same shared error banner.
- Chunk inspection: each document row requests `/api/documents/:id` and displays the returned stored chunk records.
- Research empty state: metrics and cases remain unavailable until `/api/benchmark/run` returns live evaluation data.

## Accessibility and responsiveness

- UI uses semantic structure and button labels, but no accessibility audit has been completed.
- Layout is responsive via Tailwind utility classes in component files.
- No automated accessibility tests are configured.

## Visualization rules

- Metrics and benchmark output are shown on the benchmark tab and report tab.
- Demo values are labeled as benchmark data rather than live user data, though some initial metric placeholders are used by default.
- Any live user result must be traceable to an actual API response.
