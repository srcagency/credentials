'use strict'

const test = require('tape')
const pw = require('../')

test('compatibility with v1 (store format, not package)', t => {
	const pbkdf2 =
		'{"hashMethod":"pbkdf2","salt":"l2YExDSLfIEwKGNyl8nwFeqA1x5LlpCRmr4xQndlXpW4uwW6KTIrwVD6xyHELVDVAn2VErTiXC3JXaQSavEInw9f","hash":"Tfobv+rvC7daPs3eaPpfm2FqMu48VP6jkzIrE9TUJp8zY5nRhpBoDHlpOOgOt0SJXbN6pF5/I1K8LXKUIGJUrZXM","keyLength":66,"iterations":655217}'

	t.plan(1)
	pw.verify(pbkdf2, 'foo').then(isValid => t.ok(isValid))
})

test('compatibility with v2 (store format, not package)', t => {
	const pbkdf2 =
		'{"hashMethod":"pbkdf2-sha512","salt":"cdTGLYOz7lMtQfy7rFeazUfKRm7qWvfgnIzMeBWCKPm5QLEWr2MYWQ68NPbq/Y9TVFOBh0XMDSkmL1HGxyhNlQ==","hash":"cC3eniGMFhSZAJMxMINxPYwCDrnXusrEd4+qhpRd5DNPZexepAqHgiwsR1TvB7EHUq1BuE8fsOUyhVvCX9tyvA==","keyLength":64,"iterations":655226}'

	t.plan(1)
	pw.verify(pbkdf2, 'foo').then(isValid => t.ok(isValid))
})
