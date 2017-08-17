
/**
 *  My Test Class.
 */
export class TestClass extends OtherClass {

    static prop = 'this is a static property. ES2015 stage-1 proposal.';

    /**
     *  Some constructor.
     *  @hideconstructor
     */
    constructor() {
        this.value = 1;
    }

    /**
     *  Instance (arrow) method.
     *  @return {Number}
     */
    arrowMethod = () => {
        return true;
    }

    /**
     *  Instance method.
     *  @return {Number}
     */
    instanceMethod() {
        return this.value;
    }
}
