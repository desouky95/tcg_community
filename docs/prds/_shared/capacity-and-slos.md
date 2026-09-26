# Capacity and service-level baseline

These are planning assumptions, not forecasts.

| Stage | MAU / DAU | Peak API load | Relational / media storage | Availability |
| --- | ---: | ---: | ---: | ---: |
| Launch | 10k / 1k | 10–25 RPS | 10 GB / 250 GB | 99.9% |
| Growth | 100k / 10k | 100–250 RPS | 100 GB / 2.5 TB | 99.9% |
| Regional | 1m / 100k | 500–1,000 RPS | 1 TB / 25 TB | 99.95% |

The workload model assumes 50 reads and 5 writes per DAU per day, 4–10x peak-to-average traffic, 1 KB average relational event, and media dominated by card/listing images. Interactive read p95 is 400 ms at launch and 300 ms at growth; command p95 excluding providers is 700 ms. Payment webhook acknowledgement p95 is 2 seconds. Realtime event delivery p95 is 3 seconds for connected users.

Launch RPO/RTO are 15 minutes / 60 minutes. Growth and regional targets are 5 minutes / 30 minutes. Backups are encrypted, restored quarterly, and retained according to data class. Capacity review triggers at 60% sustained database CPU, 70% storage, 70% queue-age SLO, or two consecutive months above 70% of the active envelope.
