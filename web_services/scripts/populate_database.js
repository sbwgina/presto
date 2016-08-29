db = db.getSiblingDB("presto_demo");

db.audit_reports.insert({"title": "One"});
db.audit_reports.insert({"title": "Two"});
db.audit_reports.insert({"title": "Three"});

db.sites.insert({
    "site_number": 1, "pdc_number": 1, "pdc_status": "assigned", "pdc_assigned_state": "not_visited"
});
db.sites.insert({
    "site_number": 2, "pdc_number": 1, "pdc_status": "complete",
    "pdc_completed_date": new Date("03/14/2016"),
    "visitdate": new Date("03/03/2016")
});
db.sites.insert({
    "site_number": 3, "pdc_status": "unassigned", "pdc_assigned_state": "not_visited"
});