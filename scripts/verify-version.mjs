// Guards the version number BEFORE a tag exists, which is the only moment it
// can still be guarded.
//
// The Release workflow already refuses to publish when the tag and the manifest
// disagree — but by then the tag has been pushed, and a pushed tag is the
// artefact consumers actually install: this package is documented as a git
// dependency (`npm install github:codebar-ag/storybook.codebar.ch#v1.7.0`), so a
// tag resolves and installs whether or not the release ever succeeded.
//
// That is how v1.17.0 happened. `release/v1.16.1` was bumped correctly to 1.16.1
// and then tagged v1.17.0 by hand. The Release run failed at the mismatch guard,
// so 1.16.1 never reached the registry and no GitHub Release was cut — and yet
// consuming apps pinned v1.17.0 and got a build whose package.json says 1.16.1.
// Nothing was broken, and nothing said so either.
//
// So: the manifest version must be strictly ahead of every tag that already
// exists. A number that is already taken cannot be released under that name a
// second time, and a tag cut with the wrong name burns that number permanently.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/** @returns {[number, number, number]} */
function parse(version) {
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-|\+|$)/.exec(version);

    if (!match) {
        throw new Error(`Not a semantic version: ${version}`);
    }

    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compare(a, b) {
    const left = parse(a);
    const right = parse(b);

    for (let i = 0; i < 3; i += 1) {
        if (left[i] !== right[i]) {
            return left[i] - right[i];
        }
    }

    return 0;
}

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));

const tags = execFileSync('git', ['tag', '--list', 'v*'], { encoding: 'utf8' })
    .split('\n')
    .map((tag) => tag.trim())
    .filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag));

if (tags.length === 0) {
    console.error(
        'No v* tags are visible. Fetch them before running this — ' +
            'in CI that means actions/checkout with `fetch-depth: 0`.',
    );
    process.exit(1);
}

const taken = tags.find((tag) => tag.slice(1) === version);

if (taken) {
    console.error(
        `package.json is ${version}, but tag ${taken} already exists.\n` +
            'That number is spent: the tag is permanent and installable as a git ' +
            'dependency whether or not its release succeeded. Bump past it.',
    );
    process.exit(1);
}

const highest = tags.reduce((a, b) => (compare(a.slice(1), b.slice(1)) >= 0 ? a : b));

if (compare(version, highest.slice(1)) < 0) {
    console.error(
        `package.json is ${version}, behind the highest existing tag ${highest}.\n` +
            'Bump the manifest (npm version …), which derives the tag from it. ' +
            'Never write the tag name by hand.',
    );
    process.exit(1);
}
