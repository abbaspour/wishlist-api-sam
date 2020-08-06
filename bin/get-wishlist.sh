#!/bin/bash

set -euo pipefail

declare -r DIR=$(dirname "${BASH_SOURCE[0]}")

command -v curl >/dev/null || { echo >&2 "ERROR: curl not found."; exit 1; }
command -v jq >/dev/null || { echo >&2 "ERROR: jq not found."; exit 1; }

function usage() {
    cat <<END >&2
USAGE: $0 [-e env] [-a access_token] [-h]
        -e file           # .env file location (default cwd)
        -a access_token  # Auth0 tenant@region
        -h|?             # usage

eg,
     $0
END
    exit $1
}

[[ -f ${DIR}/.env ]] && source "${DIR}"/.env

declare access_token

while getopts "e:a:h?" opt
do
    case ${opt} in
        e) source "${OPTARG}";;
        a) access_token="${OPTARG}";;
        h|?) usage 0;;
        *) usage 1;;
    esac
done

[[ -n "${access_token}" ]] || { echo >&2 "ERROR: access_token not defined."; exit 1; }
[[ -n "${apiId}" ]] || { echo >&2 "ERROR: apiId not defined."; exit 1; }
[[ -n "${region}" ]] || { echo >&2 "ERROR: region not defined."; exit 1; }
[[ -n "${stage}" ]] || { echo >&2 "ERROR: stage not defined."; exit 1; }

curl -H "Authorization: Bearer ${access_token}" \
    -sS https://${apiId}.execute-api.${region}.amazonaws.com/${stage}/wishlist | jq .
