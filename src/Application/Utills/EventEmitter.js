export default class EventEmitter
{
    constructor()
    {
        this.callbacks = {}
        this.callbacks.base = {}
    }

    // 이벤트 등록
    on(_names, callback)
    {
        // 에러 처리
        if(typeof _names === 'undefined' || _names === '')
        {
            console.warn('wrong names')
            return false
        }

        if(typeof callback === 'undefined')
        {
            console.warn('wrong callback')
            return false
        }

        // 전달받은 이벤트의 name들을 분리하여 배열담은 후 할당
        const names = this.resolveNames(_names)

        // 절달받은 모든 이벤트를 조건에 따라 처리
        names.forEach((_name) =>
        {
            // name을 original, value, namespace로 객체 생성
            const name = this.resolveName(_name)

            // callbacks에 존재하지 않는 obj형의 namespace라면 obj로 초기화
            if(!(this.callbacks[ name.namespace ] instanceof Object))
                this.callbacks[ name.namespace ] = {}

            // callbacks에 존재하지 않는 arr형의 namespace라면 arr로 초기화
            if(!(this.callbacks[ name.namespace ][ name.value ] instanceof Array))
                this.callbacks[ name.namespace ][ name.value ] = []

            // callbacks에 해당 namespace로 추가
            this.callbacks[ name.namespace ][ name.value ].push(callback)
        })

        // return this 는 반환 값으로 다시 EventEmitter 인스턴스를 반환하여 매서드체인을 지원할 수 있도록 해줌
        // ex) emitter.on('newEvent', () => console.log('event!')).on().trigger()...
        return this
    }

    off(_names)
    {
        // 존재하지 않는 이벤트면 에러 발생
        if(typeof _names === 'undefined' || _names === '')
        {
            console.warn('wrong name')
            return false
        }

        // Resolve names
        const names = this.resolveNames(_names)

        // names에 담긴 name 순회
        names.forEach((_name) =>
        {
            // Resolve name
            const name = this.resolveName(_name)

            // namespace만 존재하는 경우 삭제
            if(name.namespace !== 'base' && name.value === '')
            {
                delete this.callbacks[ name.namespace ]
            }

            // 조건에 따른 이벤트 삭제 처리
            else
            {
                // namespace가 default일때
                if(name.namespace === 'base')
                {
                    // namespace를 순회하며 삭제 처리 시도
                    for(const namespace in this.callbacks)
                    {
                        if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array)
                        {
                            delete this.callbacks[ namespace ][ name.value ]

                            // Remove namespace if empty
                            if(Object.keys(this.callbacks[ namespace ]).length === 0)
                                delete this.callbacks[ namespace ]
                        }
                    }
                }

                // namespace가 지정되어있는 이벤트인 경우 삭제 처리
                else if(this.callbacks[ name.namespace ] instanceof Object && this.callbacks[ name.namespace ][ name.value ] instanceof Array)
                {
                    delete this.callbacks[ name.namespace ][ name.value ]

                    // name이 존재하지 않고 namespace만 존재하여도 삭제
                    if(Object.keys(this.callbacks[ name.namespace ]).length === 0)
                        delete this.callbacks[ name.namespace ]
                }
            }
        })

        return this
    }

    // 이벤트 트리거
    trigger(_name, _args)
    {
        // 비어있다면 에러 발생
        if(typeof _name === 'undefined' || _name === '')
        {
            console.warn('wrong name')
            return false
        }

        let finalResult = null
        let result = null

        // default args
        const args = !(_args instanceof Array) ? [] : _args

        // resolve names (이벤트가 반드시 1개이상 존재해야 작동)
        let name = this.resolveNames(_name)

        // resolve name
        name = this.resolveName(name[ 0 ])

        // default namespace
        if(name.namespace === 'base')
        {
            // 각 네임스페이스에서 콜백 찾기 시도
            for(const namespace in this.callbacks)
            {
                if(this.callbacks[ namespace ] instanceof Object && this.callbacks[ namespace ][ name.value ] instanceof Array)
                {
                    this.callbacks[ namespace ][ name.value ].forEach(function(callback)
                    {
                        result = callback.apply(this, args)

                        if(typeof finalResult === 'undefined')
                        {
                            finalResult = result
                        }
                    })
                }
            }
        }

        // 이벤트 처리를 위한 조건문
        else if(this.callbacks[ name.namespace ] instanceof Object)
        {
            // 존재하지 않는다면 에러 발생
            if(name.value === '')
            {
                console.warn('wrong name')
                return this
            }

            // 이벤트 처리
            this.callbacks[ name.namespace ][ name.value ].forEach(function(callback)
            {
                result = callback.apply(this, args)

                if(typeof finalResult === 'undefined')
                    finalResult = result
            })
        }

        return finalResult
    }

    // _names를 분리 후 배열에 담고 반환하는 매서드
    resolveNames(_names)
    {
        let names = _names
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
        names = names.replace(/[,/]+/g, ' ')
        names = names.split(' ')

        return names
    }

    // name을 original, value, namespace로 객체를 생성 후 반환하는 매서드
    resolveName(name)
    {
        const newName = {}
        const parts = name.split('.')

        newName.original  = name
        newName.value     = parts[ 0 ]
        newName.namespace = 'base' // Base namespace

        // 전달인자로 namespace.name 이런 형식으로 들어온 경우 name과 namespace로 분리하여 할당
        // { namespace: 'namespace', value: 'name' }
        // 이 후 namespace: { name: [callback, callback2, ...] } 이러한 형태로 등록, 호출 ( on 매서드를 통해 등록한 그대로 호출하면 정상 작동 )
        if(parts.length > 1 && parts[ 1 ] !== '')
        {
            newName.namespace = parts[ 1 ]
        }

        return newName
    }
}