---
title: Curriculum Vitae
layout: about
date: 2026-08-01
---

# Personal Statement
I am a software engineer specializing in high-performance systems, networking, and security. With a background in cybersecurity and experience in trading infrastructure, I design and optimize low-latency C++ systems, network observability platforms, and performance-critical software using modern C++ and Rust.

## Work Experience

### Software Engineer

**PhotonChord Tech Inc.**  
Hangzhou, Zhejiang, China  
Jul 2023 – Present

Intern: Jul 2023 – Nov 2024  
Full-time: Nov 2024 – Present

Developed high-performance trading infrastructure, including both order execution systems and market data distribution systems.

#### Trading Gateway Performance Optimization
 - Analyzed the gateway threading model and identified microsecond-level latency bottlenecks through detailed performance instrumentation.
 - Reverse-engineered a closed-source gateway to decode its SSL traffic and undocumented communication protocol.
 - Implemented a Rust-based SSL session key extraction tool to enable offline packet decryption and traffic analysis.
 - Improved median gateway latency from **13.428 μs** (with Solarflare Onload, comparable to the best commercially available implementation) to **12.338 μs**, achieving an approximately **8.1%** reduction through user-space execution-path optimization and dynamic library hooking, without modifying the original gateway binary.
 - Developed a Rust-based offline traffic analysis platform for continuous gateway latency measurement and performance regression detection.

#### End-to-End Market Data Gateway Link Analysis Platform

 - Architected and implemented an end-to-end gateway link analysis platform, covering data collection, aggregation, visualization, and real-time performance monitoring.
 - Designed a modular C++ packet-processing pipeline inspired by Java Netty, enabling flexible protocol-layer extensions while collecting metadata across the data-link, network, transport, and application layers.
 - Eliminated runtime polymorphism by leveraging C++20 Concepts and templates instead of virtual dispatch, reducing runtime overhead and improving type safety for latency-sensitive packet processing.
 - Developed a Rust-based backend to ingest network traffic analysis results from centralized log servers and stream serialized telemetry to Web clients over WebSocket.
 - Built a WebAssembly-powered frontend to efficiently visualize large volumes of real-time network telemetry with low client-side overhead.
 - Enabled real-time comparison of transmission latency across multiple dedicated network links and rapid identification of packet loss, disconnections, and routing anomalies, significantly improving gateway observability and production troubleshooting.

#### Additional Engineering Contribution
 - Improved opscli, a CLI-based trading test tool, by designing an extensible rendering framework supporting ANSI colorized output and structured data presentation formats, including tables and key-value views, improving readability and efficiency during trading workflow inspection.
 - Optimized instrument filtering in opscli by caching compiled regular expressions instead of recompiling patterns for each query, reducing regex matching overhead to less than 1% of the original cost in local benchmarks.

## Education
### Master of Engineering in Cybersecurity
**University of Chinese Academy of Sciences**
Beijing, China
Sep 2020 - Jun 2024

Research focus: Cryptography, Side-channel Analysis, and System Security

### Bachelor of Engineering in Computer Science and Technology
**Zhejiang University**
Zhejiang, China
Sep 2016 - Jun 2020

## Honors & Awards
 - **Silver Medal (30th Place)**, [ACM-ICPC Asia Shenyang Regional Contest](https://icpc.global/regionals/finder/shenyang-2018/standings) (2017).  
   Team captain of *Aftermath*.
 - **Bronze Medal (72nd Place)**, [China Collegiate Programming Contest (CCPC) Hangzhou Regional Contest](https://ccpc.io/post/97) (2017).  
   Team captain of *Aftermath*.
 - **9th Place**, [DEF CON CTF Qualifier](https://ctftime.org/event/2229) (2024).  
   Member of [*NeSE*](https://nese.team/members/active/) CTF team.
 - **16th Place**, [DEF CON CTF Qualifier](https://ctftime.org/event/1871) (2023).  
   Member of [*NeSE*](https://nese.team/members/active/) CTF team.
 - **First-Class Scholarship**, Zhejiang University (2017, 2018).

## Technical Skills
 - **Programming Languages:** C/C++, Rust, Python3
 - **Systems & Architecture:** x86 Assembly, Computer Architecture, Low-level Debugging
 - **Reverse Engineering:** Static and Dynamic Binary Analysis, Proprietary Protocol Reverse Engineering
 - **Networking & Performance:** TCP/IP Networking, Solarflare Onload, Packet Analysis, Low-latency Optimization
 - **Security:** Cryptography, Side-channel Analysis, SSL/TLS Traffic Analysis

## Languages
- **Chinese:** Native
- **English:** Professional working proficiency