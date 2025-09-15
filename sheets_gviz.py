import json, re, urllib.parse, urllib.request
def _gviz_url(sheet_id, sheet_tab):
    qs = urllib.parse.urlencode({"sheet": sheet_tab, "tqx": "out:json"})
    return f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?{qs}"
def fetch_gviz(sheet_id, sheet_tab):
    if not sheet_id or not sheet_tab: raise ValueError("sheet_id e sheet_tab são obrigatórios")
    with urllib.request.urlopen(_gviz_url(sheet_id, sheet_tab), timeout=20) as resp:
        raw = resp.read().decode("utf-8","ignore")
    m = re.search(r"google\.visualization\.Query\.setResponse\((.*)\);?$", raw, re.S)
    if not m: raise RuntimeError("Resposta GViz inesperada (permissões/aba).")
    payload = json.loads(m.group(1)); table = payload.get("table", {})
    cols = [c.get("label") or c.get("id") for c in table.get("cols", [])]
    rows = [[None if c is None else c.get("v") for c in r.get("c", [])] for r in table.get("rows", [])]
    return {"cols": cols, "rows": rows}
