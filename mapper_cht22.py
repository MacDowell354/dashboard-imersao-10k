import os, datetime
CONFIG = {"tab": os.environ.get("SHEET_TAB","inputs_dashboard_cht22"),
"columns": {"dias_campanha":"Dias Campanha","status":"Status","total_leads":"Total Leads",
"meta_cpl":"Meta CPL","cpl_atual":"CPL Atual","orcamento_meta":"Orçamento Meta",
"orcamento_atual":"Orçamento Atual","roas_geral":"ROAS Geral",
"facebook_leads":"Facebook Leads","facebook_cpl":"Facebook CPL","facebook_roas":"Facebook ROAS","facebook_invest":"Facebook Invest","facebook_share":"% Facebook",
"instagram_leads":"Instagram Leads","instagram_cpl":"Instagram CPL","instagram_roas":"Instagram ROAS","instagram_invest":"Instagram Invest","instagram_share":"% Instagram",
"youtube_leads":"YouTube Leads","youtube_cpl":"YouTube CPL","youtube_roas":"YouTube ROAS","youtube_invest":"YouTube Invest","youtube_share":"% YouTube",
"googleads_leads":"Google Ads Leads","googleads_cpl":"Google Ads CPL","googleads_roas":"Google Ads ROAS","googleads_invest":"Google Ads Invest","googleads_share":"% Google Ads",
"email_leads":"Email Leads","email_share":"% Email",
"taxa_conversao":"Taxa Conversão (%)","ticket_curso":"Ticket Médio Curso","pct_mentoria":"% Vendas Mentoria","ticket_mentoria":"Ticket Médio Mentoria","invest_total":"Investimento Tráfego"},
"prof_columns":{"profissao":"Profissão","canais":["Google Search","YouTube","Facebook","Instagram","Email"]},
"regiao_columns":{"estado":"Estado","leads":"Leads"}}
def _col(cols, rows, name):
    if name not in cols: return None
    idx = cols.index(name)
    for r in rows:
        if idx < len(r) and r[idx] not in (None,""): return r[idx]
    return None
def _as_float(v):
    try:
        if v in (None,""): return 0.0
        return float(str(v).replace("R$","").replace(".","").replace(",","."))
    except: return 0.0
def _as_int(v):
    try:
        if v in (None,""): return 0
        return int(float(str(v).replace(".","").replace(",",".")))
    except: return 0
def build_payload(table_main, table_prof=None, table_regiao=None):
    cols, rows = table_main["cols"], table_main["rows"]; C = CONFIG["columns"]
    kpis = {"dias_campanha":_as_int(_col(cols,rows,C["dias_campanha"])),
            "status":_col(cols,rows,C["status"]) or "Em andamento",
            "total_leads":_as_int(_col(cols,rows,C["total_leads"])),
            "meta_cpl":_as_float(_col(cols,rows,C["meta_cpl"])),
            "cpl_atual":_as_float(_col(cols,rows,C["cpl_atual"])),
            "orcamento_captacao_meta":_as_float(_col(cols,rows,C["orcamento_meta"])),
            "orcamento_captacao_atual":_as_float(_col(cols,rows,C["orcamento_atual"])),
            "roas_geral":_as_float(_col(cols,rows,C["roas_geral"]))}
    def canal(p):
        return {"leads":_as_int(_col(cols,rows,C.get(f"{p}_leads",""))),
                "cpl":_as_float(_col(cols,rows,C.get(f"{p}_cpl",""))),
                "roas":_as_float(_col(cols,rows,C.get(f"{p}_roas",""))),
                "investimento":_as_float(_col(cols,rows,C.get(f"{p}_invest",""))),
                "share":_as_float(_col(cols,rows,C.get(f"{p}_share","")))}
    canais={"facebook":canal("facebook"),"instagram":canal("instagram"),"youtube":canal("youtube"),
            "google_ads":canal("googleads"),
            "email":{"leads":_as_int(_col(cols,rows,C.get("email_leads",""))),"cpl":0.0,"roas":None,"investimento":0.0,"share":_as_float(_col(cols,rows,C.get("email_share","")))}}
    taxa=_as_float(_col(cols,rows,C["taxa_conversao"])) / 100.0
    tick_c=_as_float(_col(cols,rows,C["ticket_curso"]))
    pct_m=_as_float(_col(cols,rows,C["pct_mentoria"])) / 100.0
    tick_m=_as_float(_col(cols,rows,C["ticket_mentoria"]))
    invest=_as_float(_col(cols,rows,C["invest_total"]))
    vendas=int(round(kpis["total_leads"]*taxa)); vm=int(round(vendas*pct_m)); vc=max(vendas-vm,0)
    fat_c=vc*tick_c; fat_m=vm*tick_m; fat_tot=fat_c+fat_m; lucro=max(fat_tot-invest,0.0); roas=(fat_tot/invest) if invest>0 else 0.0
    prof=[]; 
    if table_prof:
        pcols,prows=table_prof["cols"],table_prof["rows"]; key="Profissão"; canais_prof=CONFIG["prof_columns"]["canais"]
        if key in pcols:
            ip=pcols.index(key)
            for r in prows:
                item={"profissao":(r[ip] if ip<len(r) else None)}
                for cn in canais_prof:
                    val=0
                    if cn in pcols:
                        idx=pcols.index(cn); val=r[idx] if idx<len(r) else 0
                    item[cn]=_as_int(val)
                prof.append(item)
    reg=[]
    if table_regiao:
        rcols,rrows=table_regiao["cols"],table_regiao["rows"]; est="Estado"; leads="Leads"
        if est in rcols and leads in rcols:
            ie, il = rcols.index(est), rcols.index(leads)
            for r in rrows:
                if ie < len(r): reg.append({"estado":r[ie], "leads":_as_int(r[il] if il<len(r) else 0)})
    return {"kpis":kpis,"canais":canais,"profissao_por_canal":prof,"analise_regional":reg,
            "projecao_resultado":{"vendas":{"total":vendas,"curso":vc,"mentoria":vm},
                                  "faturamento":{"curso":fat_c,"mentoria":fat_m,"total":fat_tot},
                                  "lucro_total":lucro,"roas_total":roas},
            "timestamp": datetime.datetime.now().isoformat()}
