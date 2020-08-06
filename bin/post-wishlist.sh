#!/bin/bash

set -euo pipefail

declare -r DIR=$(dirname "${BASH_SOURCE[0]}")

command -v curl >/dev/null || { echo >&2 "ERROR: curl not found."; exit 1; }

function usage() {
    cat <<END >&2
USAGE: $0 [-e env] [-a access_token] [-n name] [-d description] [-u url] [-h]
        -e file           # .env file location (default cwd)
        -a access_token  # RO access_token (default from environment variables)
        -n name          # item name
        -d description   # item description
        -u url           # item url
        -h|?             # usage
eg,
     $0
END
    exit $1
}

[[ -f ${DIR}/.env ]] && source "${DIR}"/.env

declare access_token
declare name=''
declare description=''
declare url=''

while getopts "e:a:n:d:u:h?" opt
do
    case ${opt} in
        e) source "${OPTARG}";;
        a) access_token="${OPTARG}";;
        n) name="${OPTARG}";;
        d) description="${OPTARG}";;
        u) url="${OPTARG}";;
        h|?) usage 0;;
        *) usage 1;;
    esac
done

[[ -n "${access_token}" ]] || { echo >&2 "ERROR: access_token not defined."; exit 1; }
[[ -n "${apiId}" ]] || { echo >&2 "ERROR: apiId not defined."; exit 1; }
[[ -n "${region}" ]] || { echo >&2 "ERROR: region not defined."; exit 1; }
[[ -n "${stage}" ]] || { echo >&2 "ERROR: stage not defined."; exit 1; }
[[ -n "${name}" ]] || { echo >&2 "ERROR: name not defined."; usage 2; }

declare body=$(cat <<EOL
{
  "name": "${name}",
  "description": "${description}",
  "url": "${url}"
}
EOL
)

curl -H "Content-Type: application/json" \
   -H "Authorization: Bearer ${access_token}" \
   -X POST \
   -i \
   -d "${body}" \
   https://${apiId}.execute-api.${region}.amazonaws.com/${stage}/wishlist

