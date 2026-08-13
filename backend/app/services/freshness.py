from datetime import date


def calculate_freshness(expiry_date: date) -> str:
    today = date.today()
    days_left = (expiry_date - today).days

    if days_left < 0:
        return "Expired"

    elif days_left <= 2:
        return "Expiring Soon"

    else:
        return "Fresh"