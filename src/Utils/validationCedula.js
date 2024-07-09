
export function isValidCI(ci) {
    var isNumeric = true;
    var total = 0, individual;

    for (var position = 0; position < 10; position++) {
        individual = ci.toString().substring(position, position + 1);

        if (isNaN(individual)) {
            isNumeric = false;
            break;
        } else {
            if (position < 9) {
                if (position % 2 === 0) {
                    if (parseInt(individual) * 2 > 9) {
                        total += 1 + ((parseInt(individual) * 2) % 10);
                    } else {
                        total += parseInt(individual) * 2;
                    }
                } else {
                    total += parseInt(individual);
                }
            }
        }
    }

    if ((total % 10) !== 0) {
        total = (total - (total % 10) + 10) - total;
    } else {
        total = 0;
    }

    if (isNumeric) {
        if (ci.toString().length !== 10) {
            return "La cédula debe ser de 10 dígitos.";
        }

        if (parseInt(ci, 10) === 0) {
            return "La cédula ingresada no puede ser cero.";
        }

        if (total !== parseInt(individual)) {
            return "La cédula ingresada no es válida.";
        }

        return "";
    }

    return "El dato solo puede contener números.";
}
