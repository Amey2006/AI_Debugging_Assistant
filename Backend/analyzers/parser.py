import re


def parse_error(error_message: str):
    error_type = "UnknownError"
    line_number = None

    # Extract error type
    match = re.search(r"([A-Za-z]+Error)", error_message)

    if match:
        error_type = match.group(1)

    # Extract line number
    line_match = re.search(r"line (\d+)", error_message)

    if line_match:
        line_number = int(line_match.group(1))

    return {
        "error_type": error_type,
        "line_number": line_number
    }