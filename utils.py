from datetime import datetime
from typing import Any, Dict

# ----------------------------------------------------------------------
# Funções de conversão e formatação
# ----------------------------------------------------------------------

def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        if isinstance(value, (int, float)):
            return float(value)
        s = str(value).strip().replace("R$", "").replace(".", "").replace(",", ".")
        return float(s)
    except Exception:
        return default

def formatar_numero_ptbr(value: Any, casas: int = 0) -> str:
    v = _to_float(value, 0.0)
    fmt = f"{{:,.{casas}f}}".format(v)
    return fmt.replace(",", "X").replace(".", ",").replace("X", ".")

def formatar_moeda_ptbr(value: Any) -> str:
    return f"R$ {formatar_numero_ptbr(value, 2)}"

def formatar_percentual_ptbr(value: Any) -> str:
    return f"{formatar_numero_ptbr(value, 2)}%"

# ----------------------------------------------------------------------
# Filtros para uso no Jinja2
# ----------------------------------------------------------------------

def criar_filtros_jinja() -> Dict[str, Any]:
    return {
        "numero_ptbr": formatar_numero_ptbr,
        "moeda_ptbr": formatar_moeda_ptbr,
        "percentual_ptbr": formatar_percentual_ptbr,
    }

# ----------------------------------------------------------------------
# Outros utilitários (placeholders)
# ----------------------------------------------------------------------

def aplicar_formatacao_ptbr(data: dict) -> dict:
    # Aqui você pode aplicar a formatação em massa, se necessário
    return data

def calcular_percentual_seguro(valor_parcial: float, valor_total: float) -> float:
    try:
        if valor_total == 0:
            return 0.0
        return (valor_parcial / valor_total) * 100.0
    except:
        return 0.0

def log_dados_dashboard(dados: dict) -> None:
    # Placeholder para log - pode usar print ou logging
    print(f"[LOG] {datetime.now().isoformat()} - Dados recebidos: {dados}")

# ----------------------------------------------------------------------
# Validação (opcional, pode ajustar)
# ----------------------------------------------------------------------

def validar_dados_dashboard(dados: dict) -> bool:
    return isinstance(dados, dict) and "canais" in dados
