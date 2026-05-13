# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Intent

Timezone-aware project management platform designed for distributed teams split between Italy (CET/CEST, UTC+1/+2) and the United States. Core problem: surfacing overlap windows, scheduling across a 6–9h gap, and keeping async communication structured.

## Repository Status

The codebase is at greenfield stage — no source files exist yet. Architecture and stack are to be decided. See conversation history for initial requirements.

## Key Domain Concepts

- All timestamps must be stored in UTC; display in the viewer's local timezone
- "Overlap window": typically 15:00–18:00 IT / 09:00–12:00 EST — this should be a first-class UI concept
- Team members each have a `timezone` field; deadlines render differently per viewer
