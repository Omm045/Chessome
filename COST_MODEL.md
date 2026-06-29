# Chessome: Cost Model & Scaling Economics

## 1. The Cost of Free Analysis
Unlike typical SaaS platforms, Chessome's primary feature (Engine Analysis) requires heavy, continuous CPU cycles. Running Stockfish at 5M nodes/second is not "serverless" friendly. This cost model projects AWS/Cloudflare pricing based on active cloud users.

*(Note: Users utilizing Local WASM analysis cost the platform $0 in compute).*

## 2. Monthly Projections

### Scenario A: 100 Daily Active Users (DAU)
The "Hobbyist / Beta" stage.
- **Compute (Web/API)**: 1x t4g.small ($12/mo)
- **Compute (Worker)**: 1x c7g.large (2 vCPU) ($60/mo)
- **Database**: Managed Postgres Basic ($15/mo)
- **Redis**: Managed Redis Basic ($15/mo)
- **CDN/Egress**: Cloudflare Free ($0)
- **Total Estimated Cost**: **~$102 / month**

### Scenario B: 1,000 DAU
The "Growing Community" stage.
- **Compute (Web/API)**: 2x t4g.medium ($34/mo)
- **Compute (Workers)**: Auto-scaling pool of c7g.xlarge Spot Instances. Averaging 4 instances running 12 hours a day ($120/mo)
- **Database**: RDS Postgres t4g.medium ($50/mo)
- **Redis**: Elasticache t4g.micro ($15/mo)
- **Total Estimated Cost**: **~$219 / month**

### Scenario C: 10,000 DAU
The "Professional Traffic" stage.
- **Compute (Web/API)**: 4x c7g.large ($240/mo)
- **Compute (Workers)**: KEDA Auto-scaling Spot Fleet (c7g.2xlarge). Averaging 15 instances ($900/mo)
- **Database**: RDS Postgres r7g.large (Memory optimized for cache hits) ($200/mo)
- **Redis**: Elasticache m7g.large (For massive PubSub & BullMQ traffic) ($120/mo)
- **Total Estimated Cost**: **~$1,460 / month**

### Scenario D: 100,000 DAU to 1 Million DAU
The "Industry Leader" stage. At this scale, raw AWS compute becomes financially unsustainable for an open-source project relying on donations.
- **The Shift to Bare Metal**: Instead of AWS EC2, the Worker pool must migrate to dedicated bare-metal hosting (e.g., Hetzner or OVH).
- **Hetzner Dedicated AX102 (AMD Ryzen 9 7950X3D, 128GB RAM)**: ~$120/mo.
- A cluster of 20 Hetzner servers ($2,400/mo) provides vastly more Stockfish computing power than $10,000/mo of AWS EC2 instances.
- **Total Estimated Cost (Hybrid Cloud)**: AWS for API/DB reliability (~$1,500/mo) + Hetzner for raw Worker compute (~$2,400/mo) = **~$3,900 / month**.

## 3. Unit Economics & Sustainability
- **Cost per Game Review (Cloud)**: ~0.1 CPU minutes = ~$0.0001
- **Cost per AI Explanation (BYOK)**: $0 to the platform (paid by user's OpenAI key).
- **Funding Strategy**: To sustain the 100,000 DAU tier, the project requires ~$4k/mo in GitHub Sponsors, OpenCollective donations, or a Patreon model (e.g., offering a "Supporter Badge" that gives priority queue access).

## 4. Architectural Cost-Saving Measures
1. **Spot Instances / Preemptible VMs**: Cloud workers are completely stateless. Using AWS Spot instances saves up to 70% on compute costs. If a Spot instance is terminated mid-evaluation, BullMQ simply retries the job on a surviving node.
2. **Aggressive WASM Defaults**: 90% of casual users do not need depth-22 cloud analysis. Defaulting all non-logged-in users to Local WASM analysis removes 90% of the compute burden.
3. **Global FEN Caching**: Never evaluate the same position twice. (See `CACHE_ARCHITECTURE.md`).
